"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { searchTreeSpecies } from "@/lib/api"
import Link from "next/link"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['trees', query],
    queryFn: () => searchTreeSpecies(query || ''),
    enabled: !!query,
  })

  if (!query) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center p-8 rounded-xl ">
          <h3 className="text-lg font-semibold text-green-500 mb-2">
            Start Your Tree Research
          </h3>
          <p className="text-white">
            Enter a tree species name in the search box above to discover detailed information about different trees.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-center text-gray-800 p-8 rounded-xl bg-white shadow-[inset_-12px_-12px_24px_rgba(0,0,0,0.1),_inset_12px_12px_24px_rgba(255,255,255,0.5)]">
          Loading...
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center p-8 rounded-xl bg-white shadow-[inset_-12px_-12px_24px_rgba(0,0,0,0.1),_inset_12px_12px_24px_rgba(255,255,255,0.5)]">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-600">
            We couldn&apos;t find any tree species matching {`${query}`}. Try searching with a different name or check your spelling.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex-1 overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((tree) => (
          <Link 
            key={tree.id} 
            href={`/species/${tree.id}`} 
            className="bg-white p-6 rounded-xl transition-all duration-300
              "
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {tree.species_common_name}
            </h2>
            <p className="text-gray-600 italic">{tree.species_scientific_name}</p>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-700">
                <span className="font-medium text-gray-900">Family:</span> {tree.family}
              </li>
              <li className="text-gray-700">
                <span className="font-medium text-gray-900">Genus:</span> {tree.genus}
              </li>
              <li className="text-gray-700">
                <span className="font-medium text-gray-900">Subspecies:</span>{" "}
                {tree.subspecies || "N/A"}
              </li>
              <li className="text-gray-700">
                <span className="font-medium text-gray-900">Class:</span> {tree.taxonomic_class}
              </li>
              <li className="text-gray-700">
                <span className="font-medium text-gray-900">Order:</span> {tree.taxonomic_order}
              </li>
            </ul>
          </Link>
        ))}
      </div>
    </div>
  )
}
"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useResearchContext } from "@/context/research-context"
import { useQuery } from "@tanstack/react-query"
import { searchTreeSpecies } from "@/lib/api"
import Link from "next/link"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const { setSelectedSpecies } = useResearchContext()

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['trees', query],
    queryFn: () => searchTreeSpecies(query || ''),
    enabled: !!query,
  })

  if (!query) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Start Your Tree Research
          </h3>
          <p className="text-white/70">
            Enter a tree species name in the search box above to discover detailed information about different trees.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-center text-white">Loading...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            No Results Found
          </h3>
          <p className="text-white/70">
            We couldn&apos;t find any tree species matching {`${query}`}. Try searching with a different name or check your spelling.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((tree) => (
          <div key={tree.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-xl font-semibold text-green-800">
              {tree.commonName}
            </h2>
            <p className="text-gray-600 italic">{tree.species_scientific_name}</p>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="font-medium">Family:</span> {tree.family}
              </li>
              <li>
                <span className="font-medium">Genus:</span> {tree.genus}
              </li>
              <li>
                <span className="font-medium">Subspecies:</span>{" "}
                {tree.subspecies || "N/A"}
              </li>
              <li>
                <span className="font-medium">Class:</span> {tree.taxonomic_class}
              </li>
              <li>
                <span className="font-medium">Order:</span> {tree.taxonomic_order}
              </li>
            </ul>
            <Link href={`/species/${tree.id}`} className="flex gap-2">
              <Button
                className="mt-4 bg-green-800"
                onClick={() =>
                  setSelectedSpecies({
                    id: tree.id,
                    commonName: tree.commonName,
                    scientificName: tree.species_scientific_name,
                    family: tree.family,
                    genus: tree.genus,
                    subspecies: tree.subspecies,
                    class: tree.taxonomic_class,
                    order: tree.taxonomic_order,
                  })
                }
              >
                Research
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}